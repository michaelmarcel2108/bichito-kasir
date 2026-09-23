import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendances = await prisma.attendance.findMany({
      include: { employee: true },
      orderBy: { checkIn: 'desc' },
      take: 50, // Get last 50 attendances for performance
    });
    return NextResponse.json(attendances);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeId } = body;
    
    if (!employeeId) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    // Check if employee already has an active check-in (no checkout yet)
    const activeAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        checkOut: null,
      }
    });

    if (activeAttendance) {
      return NextResponse.json({ error: 'Employee is already checked in' }, { status: 400 });
    }

    const checkIn = new Date();
    
    const newAttendance = await prisma.attendance.create({
      data: {
        employeeId,
        checkIn,
        date: checkIn,
      },
      include: { employee: true }
    });
    
    return NextResponse.json(newAttendance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check in' }, { status: 500 });
  }
}

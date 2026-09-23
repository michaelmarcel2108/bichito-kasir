import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attendanceId } = body;
    
    if (!attendanceId) {
      return NextResponse.json({ error: 'Attendance ID is required' }, { status: 400 });
    }

    const attendance = await prisma.attendance.findUnique({
      where: { id: attendanceId },
    });

    if (!attendance) {
      return NextResponse.json({ error: 'Attendance record not found' }, { status: 404 });
    }

    if (attendance.checkOut) {
      return NextResponse.json({ error: 'Employee is already checked out' }, { status: 400 });
    }

    const checkOut = new Date();
    
    // Calculate total hours
    const diffInMs = checkOut.getTime() - new Date(attendance.checkIn).getTime();
    const diffInMinutes = diffInMs / (1000 * 60);
    
    // Pembulatan ke atas per 30 menit (contoh: 15 mnt -> 30 mnt, 45 mnt -> 60 mnt)
    const roundedMinutes = Math.ceil(diffInMinutes / 30) * 30;
    const diffInHours = roundedMinutes / 60;

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        checkOut,
        totalHours: diffInHours,
      },
      include: { employee: true }
    });
    
    return NextResponse.json(updatedAttendance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check out' }, { status: 500 });
  }
}

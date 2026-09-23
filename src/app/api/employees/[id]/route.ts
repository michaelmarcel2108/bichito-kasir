import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, role, hourlyRate } = body;

    const updatedEmployee = await prisma.employee.update({
      where: { id },
      data: {
        name,
        role,
        hourlyRate: parseFloat(hourlyRate),
      }
    });

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Delete related attendance records first to avoid foreign key constraint errors
    await prisma.attendance.deleteMany({
      where: { employeeId: id }
    });

    // Then delete the employee
    await prisma.employee.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}

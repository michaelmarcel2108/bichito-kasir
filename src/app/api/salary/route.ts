import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json({ error: 'Month and year are required' }, { status: 400 });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

    const employees = await prisma.employee.findMany({
      include: {
        Attendance: {
          where: {
            date: {
              gte: startDate,
              lte: endDate,
            },
            checkOut: { not: null } // Only count completed attendances
          }
        }
      }
    });

    const salaryReport = employees.map(emp => {
      const totalHours = emp.Attendance.reduce((acc, att) => acc + (att.totalHours || 0), 0);
      const totalSalary = totalHours * emp.hourlyRate;
      return {
        id: emp.id,
        name: emp.name,
        role: emp.role,
        hourlyRate: emp.hourlyRate,
        totalHours: totalHours.toFixed(2),
        totalSalary
      };
    });

    return NextResponse.json(salaryReport);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to calculate salaries' }, { status: 500 });
  }
}

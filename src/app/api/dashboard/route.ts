import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // 1. Total Employees
    const totalEmployees = await prisma.employee.count();

    // 2. Total Menu Items
    const totalMenuItems = await prisma.menuItem.count();

    // 3. Finance (Current Month)
    const transactions = await prisma.transaction.findMany({
      where: {
        date: { gte: startDate, lte: endDate }
      }
    });

    const income = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const profit = income - expense;

    // 4. Active Check-ins (Today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeCheckIns = await prisma.attendance.count({
      where: {
        checkIn: { gte: today },
        checkOut: null,
      }
    });

    return NextResponse.json({
      totalEmployees,
      totalMenuItems,
      finance: { income, expense, profit },
      activeCheckIns
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}

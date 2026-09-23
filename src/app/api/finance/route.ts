import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let whereClause = {};
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      whereClause = {
        date: {
          gte: startDate,
          lte: endDate,
        }
      };
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, amount, description, date } = body;
    
    if (!type || !amount || !description) {
      return NextResponse.json({ error: 'Type, amount, and description are required' }, { status: 400 });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        type, // "INCOME" or "EXPENSE"
        amount: parseFloat(amount),
        description,
        date: date ? new Date(date) : new Date(),
      }
    });
    
    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }
}

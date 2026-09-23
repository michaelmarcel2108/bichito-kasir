import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (month && year) {
      const capital = await prisma.capital.findFirst({
        where: { month: parseInt(month), year: parseInt(year) },
      });
      return NextResponse.json(capital || { amount: 0 });
    }

    const capitals = await prisma.capital.findMany({
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });
    return NextResponse.json(capitals);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch capital' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { month, year, amount } = body;
    
    if (!month || !year || amount === undefined) {
      return NextResponse.json({ error: 'Month, year, and amount are required' }, { status: 400 });
    }

    const existingCapital = await prisma.capital.findFirst({
      where: { month: parseInt(month), year: parseInt(year) },
    });

    if (existingCapital) {
      const updatedCapital = await prisma.capital.update({
        where: { id: existingCapital.id },
        data: { amount: parseFloat(amount) }
      });
      return NextResponse.json(updatedCapital);
    }

    const newCapital = await prisma.capital.create({
      data: {
        month: parseInt(month),
        year: parseInt(year),
        amount: parseFloat(amount),
      }
    });
    
    return NextResponse.json(newCapital, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save capital' }, { status: 500 });
  }
}

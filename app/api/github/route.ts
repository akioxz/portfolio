import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || process.env.NEXT_PUBLIC_GITHUB_USERNAME;
  const year = parseInt(searchParams.get("year") || "2026", 10);

  if (!username) {
    return NextResponse.json(
      { error: "Username is required. Please set NEXT_PUBLIC_GITHUB_USERNAME in .env or pass ?username=" },
      { status: 400 }
    );
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN is missing in environment variables. Falling back to static mock data." },
      { status: 500 }
    );
  }

  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username, from, to },
      }),
      next: { revalidate: 3600 },
    });

    const result = await response.json();

    if (result.errors) {
      return NextResponse.json({ error: result.errors[0].message }, { status: 400 });
    }

    const calendar = result.data.user.contributionsCollection.contributionCalendar;
    
    const days = calendar.weeks.flatMap((w: any) =>
      w.contributionDays.map((d: any) => ({
        date: d.date,
        count: d.contributionCount,
      }))
    );

    return NextResponse.json({
      total: calendar.totalContributions,
      days,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


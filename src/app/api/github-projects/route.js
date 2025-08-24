export async function GET() {
  try {
    // Replace 'your-github-username' with your actual GitHub username
    const username = process.env.GITHUB_USERNAME || "kuldeepsisodiya";
    const token = process.env.GITHUB_TOKEN; // Optional: for private repos or higher rate limits

    const headers = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Portfolio-Website",
    };

    // Add authorization header if token is available
    if (token) {
      headers["Authorization"] = `token ${token}`;
    }

    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`,
      {
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const repos = await response.json();

    // Filter and format the repositories
    const projects = repos
      .filter((repo) => !repo.fork) // Exclude forked repositories
      .map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || "No description available",
        url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated: repo.updated_at,
        topics: repo.topics || [],
      }));

    return Response.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching GitHub projects:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to fetch GitHub projects",
        message: error.message,
      },
      { status: 500 },
    );
  }
}

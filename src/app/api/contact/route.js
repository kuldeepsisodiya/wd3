export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Log the contact form submission
    console.log("📧 New Contact Form Submission:", {
      name,
      email,
      message: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
      timestamp: new Date().toISOString(),
    });

    // Create form data for Web3Forms
    const formData = new FormData();
    formData.append("access_key", "aba542dd-eab8-4ef0-b418-958f0c027b5d");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);
    formData.append("subject", `New Contact Form Message from ${name}`);

    console.log("📤 Sending to Web3Forms...");

    try {
      const web3formsResponse = await fetch(
        "https://api.web3forms.com/submit",
        {
          method: "POST",
          body: formData,
        },
      );

      console.log("📬 Web3Forms Response Status:", web3formsResponse.status);

      const responseData = await web3formsResponse.json();
      console.log("📬 Web3Forms Response:", responseData);

      if (responseData.success) {
        return Response.json({
          success: true,
          message: "✅ Message sent successfully! I'll get back to you soon.",
        });
      } else {
        console.error("❌ Web3Forms Error:", responseData);
        return Response.json(
          {
            error: "❌ Failed to send message. Please try again.",
            debug: responseData.message,
          },
          { status: 500 },
        );
      }
    } catch (web3formsError) {
      console.error("🚨 Web3Forms Request Failed:", web3formsError);

      // Fallback: Log the message
      console.log("📬 Contact Form Message (Fallback):", {
        from: `${name} <${email}>`,
        message: message,
        timestamp: new Date().toLocaleString(),
        note: "Web3Forms failed, message logged for manual follow-up",
      });

      return Response.json({
        success: true,
        message: "✅ Message received! I'll get back to you soon.",
        note: "Your message has been logged and I'll respond via email.",
      });
    }
  } catch (error) {
    console.error("💥 Contact form error:", error);
    return Response.json(
      {
        error: "❌ Failed to send message. Please try again or email directly.",
        debug: error.message,
      },
      { status: 500 },
    );
  }
}

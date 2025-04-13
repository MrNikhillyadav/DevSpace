
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {

  const { prompt } = await request.json();
  console.log('prompt: ', prompt);
  const API_KEY = process.env.GEMINI_API_KEY; 

  //@ts-expect-error : ignore the api key type error 
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  try {
    const result = await model.generateContent(prompt);

    const response = result.response.text();
    console.log('response: ', response);
    return NextResponse.json({ content: response }, { status: 200 });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
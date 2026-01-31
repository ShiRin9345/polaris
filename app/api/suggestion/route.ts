import { generateText, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { deepseek } from "@ai-sdk/deepseek";
import { auth } from "@clerk/nextjs/server";

const SUGGESTION_PROMPT = `You are a code suggestion assistant.

<context>
<file_name>{fileName}</file_name>
<previous_lines>
{previousLines}
</previous_lines>
<current_line number="{lineNumber}">{currentLine}</current_line>
<before_cursor>{textBeforeCursor}</before_cursor>
<after_cursor>{textAfterCursor}</after_cursor>
<next_lines>
{nextLines}
</next_lines>
<full_code>
{code}
</full_code>
</context>

<instructions>
Follow these steps IN ORDER:

1. **Bridge the Gap**: Compare the code at the cursor with next_lines.
   - If the current line is already logically finished and matches the next lines, return an empty string.
   - If there is a missing piece (e.g., an unclosed bracket, a missing parameter, or an unfinished logic flow) before the code in next_lines starts, suggest ONLY that missing piece.

2. **Smart Completion**: If the user is in the middle of a statement, suggest the completion.
   - Ensure your suggestion does NOT repeat the code that already exists in next_lines.
   - Truncate your suggestion at the point where it would start to overlap with next_lines.

3. **Natural Flow**: If steps 1 and 2 don't result in an empty string, provide the most likely next characters or lines based on the full_code context.

<critical_rule>
When suggesting code blocks (functions, classes, if statements, loops, objects, etc.):
- ALWAYS suggest the COMPLETE block structure (including opening brace, body, and closing brace)
- NEVER suggest only an opening brace "{" or partial block structure
- TRY TO PROVIDE A FULL IMPLEMENTATION when the intent is clear from context:
  * If user types "function quickSort", provide the complete quick sort algorithm
  * If user types "function binary", provide the complete binary search implementation
  * If user types "const user = {", provide a complete object with reasonable fields
- If you cannot infer the full implementation, provide a meaningful skeleton with comments
- Examples of GOOD suggestions:
  * "function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[0];\n  const left = arr.slice(1).filter(x => x < pivot);\n  const right = arr.slice(1).filter(x => x >= pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}"
  * "(arr, target) => {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}"
- Examples of BAD suggestions (DO NOT DO THIS):
  * "{" (only opening brace)
  * "function test() {\n  \n}" (empty body when implementation is obvious)
  * "() {" (incomplete function)
</critical_rule>
</instructions>`;

const suggestionSchema = z.object({
  suggestion: z
    .string()
    .describe(
      "The code to insert at cursor, or empty string if no completion needed",
    ),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  try {
    const {
      fileName,
      code,
      currentLine,
      previousLines,
      textBeforeCursor,
      textAfterCursor,
      nextLines,
      lineNumber,
    } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const prompt = SUGGESTION_PROMPT.replace("{fileName}", fileName)
      .replace("{code}", code)
      .replace("{currentLine}", currentLine)
      .replace("{previousLines}", previousLines || "")
      .replace("{textBeforeCursor}", textBeforeCursor)
      .replace("{textAfterCursor}", textAfterCursor)
      .replace("{nextLines}", nextLines || "")
      .replace("{lineNumber}", lineNumber.toString());

    const { output } = await generateText({
      model: deepseek("deepseek-chat"),
      output: Output.object({ schema: suggestionSchema }),
      prompt,
    });

    return NextResponse.json({ suggestion: output.suggestion });
  } catch (error) {
    console.error("Suggestion API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestion" },
      { status: 500 },
    );
  }
}

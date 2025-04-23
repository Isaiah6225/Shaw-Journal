"use client";

import Container from "../../components/ui/Container";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../../components/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../../components/ui/LoadingBackground";


const markdownGuide = `
# 📝 How to Write Blogs in Markdown

Welcome to the Markdown blog guide! Here's how you can write beautiful and structured blog posts using **Markdown** syntax.

---

## 📌 Basic Formatting

**Bold text:**  
\`**This is bold**\` → **This is bold**

*Italic text:*  
\`*This is italic*\` → *This is italic*

> **Blockquote:**  
\`> This is a quote\`  
> This is a quote

---

## 🔗 Links 

**Link:**  
\`[Google](https://google.com)\` → [Google](https://google.com)

---

## 🖊️ Headings

Use \`#\` for headings:

\`\`\`
# H1
## H2
### H3
#### H4
\`\`\`

# H1  
## H2  
### H3  
#### H4  

---

## 📋 Lists

**Unordered list:**

\`\`\`
- Item 1
- Item 2
- Item 3
\`\`\`

- Item 1
- Item 2
- Item 3

**Ordered list:**

\`\`\`
1. First
2. Second
3. Third
\`\`\`

1. First  
2. Second  
3. Third

---

## 💻 Code Snippets

**Inline code:**  
\`const x = 10;\`

**Code block:**

\`\`\`js
function greet() {
  console.log("Hello, world!");
}
\`\`\`

---

## ✅ Checklists

\`\`\`
- [x] Write blog
- [ ] Review blog
\`\`\`

- [x] Write blog  
- [ ] Review blog

---

Now you're ready to write and publish your blog!
`;

export default function MarkdownGuidePage() {

  const { role, loading: userLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && role && role !== "Author") {
      router.push("/unauthorized");
    }
  }, [role, router, userLoading]); 

  // Show nothing if role is known and not authorized
  if (!userLoading && role && role !== "Author") {
    return null;
  }


  return (
    <Container>
        {(userLoading || !role) && <Loading />} 

      <div className="max-w-4xl mx-auto px-4 py-10 prose prose-lg">
        <ReactMarkdown 
		remarkPlugins={[remarkGfm]}
		components={{
			    a: ({ node, ...props }) => (
			      <a
				{...props}
				target="_blank"
				rel="noopener noreferrer"
				className="text-blue-600 underline"
			      />
			    ),
			    h1: ({ node, ...props }) => (
			      <h1 className="text-3xl font-bold text-primary" {...props} />
			    ),
			    h2: ({ node, ...props }) => (
			      <h2 className="text-2xl font-semibold text-primary" {...props} />
			    ),
			    h3: ({ node, ...props }) => (
			      <h3 className="text-xl font-bold text-primary" {...props} />
			    ),
			    h4: ({ node, ...props }) => (
			      <h4 className="text-lg font-bold text-primary" {...props} />
			    ),
			    h5: ({ node, ...props }) => (
			      <h5 className="text-md font-bold text-primary" {...props} />
			    ),
			    p: ({ node, ...props }) => (
			      <p className="text-gray-700 leading-relaxed" {...props} />
			    ),
			    ul: ({ node, ...props }) => (
			      <ul className="list-disc pl-5 text-gray-700" {...props} />
			    ),
			    ol: ({ node, ...props }) => (
			      <ol className="list-decimal pl-5 text-gray-700" {...props} />
			    ),
			    li: ({ node, ...props }) => (
			      <li className="text-gray-700" {...props} />
			    ),
			    blockquote: ({ node, ...props }) => (
			      <blockquote className="border-l-4 pl-4 text-gray-500 italic" {...props} />
			    ),
			    code: ({ node, ...props }) => (
			      <code className="bg-gray-200 p-1 rounded-md text-sm">{props.children}</code>
			    ),
			  }}

		>
          {markdownGuide}
        </ReactMarkdown>
      </div>
    </Container>
  );
}


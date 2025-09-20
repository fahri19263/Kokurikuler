export const formatPlanText = (text: string) => {
    return text
        .split('\n')
        .map(line => {
            // Convert **text** to <strong>text</strong> with specific styling first
            const boldedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>');

            const trimmedBoldedLine = boldedLine.trim();

            // Convert lines starting with * or - to bullet points
            if (trimmedBoldedLine.startsWith('* ') || trimmedBoldedLine.startsWith('- ')) {
                // Using a styled paragraph to simulate a list item.
                // It correctly handles nested strong tags because they were processed first.
                return `<p class="mb-2 pl-6 relative before:content-['•'] before:absolute before:left-2 before:text-indigo-600">${trimmedBoldedLine.substring(2)}</p>`;
            }

            // Check if a line is ONLY a bolded title, and treat it as a heading
            if (trimmedBoldedLine.match(/^<strong.*<\/strong>$/)) {
                const titleText = trimmedBoldedLine.replace(/<[^>]*>/g, '');
                // Differentiate main headings (like "BAGIAN A") from subheadings
                if (titleText.startsWith("BAGIAN")) {
                    return `<h2 class="text-2xl font-bold mt-6 mb-3 border-b pb-2 border-slate-200 text-indigo-700">${titleText}</h2>`;
                }
                return `<h3 class="text-xl font-semibold mt-4 mb-2 text-slate-800">${titleText}</h3>`;
            }

            // Handle empty lines for spacing
            if (trimmedBoldedLine === '') {
                return '<br />';
            }

            // Return as a regular paragraph (which may contain inline strong tags)
            return `<p class="mb-2">${boldedLine}</p>`;
        })
        .join('');
};
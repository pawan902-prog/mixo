const surveyResponses = [
    {
        heading: "Select your interest(s)",
        question: "What are you interested in?",
        options: [
            "Advisory",
            "Bookkeeping",
            "Product demo",
            "AI",
            "Thought leadership",
            "Learning from peers",
            "Xero product announcements",
            "External speaker",
            "Helping my clients succeed"
        ],
        multipleSelection: true,
        answer: "Financial Advisor"
    },
    {
        heading: "Select product(s)",
        question: "Accounting products you'd like to learn about",
        options: [
            "Xero core",
            "Insightful reporting",
            "Faster payments",
            "Payroll",
            "Simplify tax",
            "Optimising inventory",
            "Streamlining practice and workflow",
            "Fixed asset management",
            "Workpapers",
            "AI in accounting",
        ],
        multipleSelection: true,
        answer: ["Ignite"]
    },
    {
        heading: "Select location",
        question: "Where are you from?",
        options: [
            "Australia", "New Zealand", "Singapore", "South Africa", "Other"
        ],
        multipleSelection: false,
        answer: ["Australia"]
    },
    {
        question: "What do you want to take away from Xerocon?",
        type: "textarea",
        placeholder: "Type your answer here...",
        maxLength: 200,
        label: "Ope"
    }
];

export default surveyResponses
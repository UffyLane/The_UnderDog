// src/components/HowItWorks/HowItWorks.jsx
import "./HowItWorks.css";

const STEPS = [
  {
    title: "Search an artist",
    description:
      "Type in any artist and we check Ticketmaster for their upcoming shows.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2" />
        <path d="M20 20l-4.6-4.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Midwest, filtered",
    description:
      "We narrow results to IL, IN, IA, KS, MI, MN, MO, NE, ND, OH, SD & WI — the shows the big national apps bury.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Save what you want",
    description:
      "Bookmark shows to your profile and come back to them whenever you're ready for tickets.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 4h12v16l-6-4-6 4V4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="how" aria-label="How The UnderDog works">
      <ol className="how__steps">
        {STEPS.map((step, index) => (
          <li className="how__step" key={step.title}>
            <div className="how__icon">{step.icon}</div>
            <p className="how__number">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="how__title">{step.title}</h3>
            <p className="how__description">{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

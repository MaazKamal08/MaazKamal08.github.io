export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company?: string;
};

// Empty by default on purpose: the site never shows a fabricated quote attributed to a real
// person. The "Testimonials" section on the homepage renders honest placeholder slots while
// this array is empty, and switches to real cards the moment you add entries here - e.g.
// { quote: "...", name: "Jane Doe", role: "Operations Lead", company: "Acme Inc" }
// Only add a quote once you have the person's permission to publish it with their name.
export const testimonials: Testimonial[] = [];

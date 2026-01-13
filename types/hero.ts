export interface HeroContent {
    title_prefix: string;
    title_highlight: string;
    title_suffix: string;
    subtitle: string;
    description: string;
    button_primary_text: string;
    button_primary_url: string;
    button_secondary_text: string;
    button_secondary_url: string;

    // Arabic Optional Overrides
    title_prefix_ar?: string;
    title_highlight_ar?: string;
    title_suffix_ar?: string;
    subtitle_ar?: string;
    description_ar?: string;
    button_primary_text_ar?: string;
    button_secondary_text_ar?: string;
}

export const defaultHeroContent: HeroContent = {
    title_prefix: "Every",
    title_highlight: "Pixel",
    title_suffix: "",
    subtitle: "Carries A Spark",
    description: "GRAPHIC DESIGNER & FRONTEND WITCH.\nCreating digital chaos with style.",
    button_primary_text: "Profile 🐰",
    button_primary_url: "/about",
    button_secondary_text: "Gallery ✨",
    button_secondary_url: "/gallery"
};

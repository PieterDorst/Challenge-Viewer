
export interface Challenge {
  id: string;
  titleLine1: string;
  titleLine2?: string; // Optional second line for the title
  frontImageUrl: string;
  altText: string; // Will be derived from titleLine1 and titleLine2
  backTextLine1: string;
  backTextLine2: string;
  linkUrl?: string; // Optional URL link for the card
}
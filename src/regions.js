// Single source of truth for the board. Imported by the UI and by the scanner
// route, so the two can never disagree about which codes are valid.
export const US = [
  ["CT", "Connecticut", "ne"], ["ME", "Maine", "ne"], ["MA", "Massachusetts", "ne"],
  ["NH", "New Hampshire", "ne"], ["RI", "Rhode Island", "ne"], ["VT", "Vermont", "ne"],
  ["NJ", "New Jersey", "ne"], ["NY", "New York", "ne"], ["PA", "Pennsylvania", "ne"],
  ["DE", "Delaware", "south"], ["FL", "Florida", "south"], ["GA", "Georgia", "south"],
  ["MD", "Maryland", "south"], ["NC", "North Carolina", "south"], ["SC", "South Carolina", "south"],
  ["VA", "Virginia", "south"], ["WV", "West Virginia", "south"], ["DC", "Washington D.C.", "south"],
  ["AL", "Alabama", "south"], ["KY", "Kentucky", "south"], ["MS", "Mississippi", "south"],
  ["TN", "Tennessee", "south"], ["AR", "Arkansas", "south"], ["LA", "Louisiana", "south"],
  ["OK", "Oklahoma", "south"], ["TX", "Texas", "south"],
  ["IL", "Illinois", "mw"], ["IN", "Indiana", "mw"], ["MI", "Michigan", "mw"], ["OH", "Ohio", "mw"],
  ["WI", "Wisconsin", "mw"], ["IA", "Iowa", "mw"], ["KS", "Kansas", "mw"], ["MN", "Minnesota", "mw"],
  ["MO", "Missouri", "mw"], ["NE", "Nebraska", "mw"], ["ND", "North Dakota", "mw"], ["SD", "South Dakota", "mw"],
  ["AZ", "Arizona", "west"], ["CO", "Colorado", "west"], ["ID", "Idaho", "west"], ["MT", "Montana", "west"],
  ["NV", "Nevada", "west"], ["NM", "New Mexico", "west"], ["UT", "Utah", "west"], ["WY", "Wyoming", "west"],
  ["AK", "Alaska", "west"], ["CA", "California", "west"], ["HI", "Hawaii", "west"], ["OR", "Oregon", "west"],
  ["WA", "Washington", "west"],
].map(([code, name, group]) => ({ code, name, group, country: "us" }));

export const CA = [
  ["ON", "Ontario"], ["QC", "Quebec"], ["BC", "British Columbia"], ["AB", "Alberta"],
  ["MB", "Manitoba"], ["SK", "Saskatchewan"], ["NS", "Nova Scotia"], ["NB", "New Brunswick"],
  ["NL", "Newfoundland and Labrador"], ["PE", "Prince Edward Island"], ["YT", "Yukon"],
  ["NT", "Northwest Territories"], ["NU", "Nunavut"],
].map(([code, name]) => ({ code, name, group: "ca", country: "ca" }));

export const ALL = [...US, ...CA];
export const CODES = ALL.map((r) => r.code);

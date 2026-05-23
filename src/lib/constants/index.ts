export const PROJECT_STATUS = [
  "Leads",
  "DP & Planning",
  "UI/UX Design",
  "Development",
  "Internal Testing",
  "Client Review",
  "Revision",
  "Pelunasan & Deploy",
  "Maintenance",
  "Archived",
] as const;

export type ProjectStatus = typeof PROJECT_STATUS[number];

export const USER_ROLES = ["superadmin", "admin", "member"] as const;

export type UserRole = typeof USER_ROLES[number];

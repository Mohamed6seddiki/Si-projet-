export function formatDateTime(dateValue: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateValue));
}

export function getStatusLabel(status: "pending" | "accepted" | "completed") {
  if (status === "pending") {
    return "En attente";
  }

  if (status === "accepted") {
    return "Acceptee";
  }

  return "Terminee";
}

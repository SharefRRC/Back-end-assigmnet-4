import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const auth = admin.auth();

async function main() {
  const officer = await auth.getUserByEmail("officer@pixell-river.com");
  const manager = await auth.getUserByEmail("manager@pixell-river.com");
  const adminUser = await auth.getUserByEmail("admin@pixell-river.com");

  await auth.setCustomUserClaims(officer.uid, { role: "officer" });
  await auth.setCustomUserClaims(manager.uid, { role: "manager" });
  await auth.setCustomUserClaims(adminUser.uid, { role: "admin" });

  console.log("Custom claims assigned successfully");
  console.log("Officer:", officer.uid);
  console.log("Manager:", manager.uid);
  console.log("Admin:", adminUser.uid);
}

main().catch((error) => {
  console.error("Failed to assign claims:", error);
  process.exit(1);
});
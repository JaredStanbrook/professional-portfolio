// scripts/create-admin.ts
import { spawn } from "child_process";
import fs from "fs";
import prompts from "prompts";
import crypto from "crypto";
import { hashPassword } from "../worker/utils/crypto";

// ==========================================
// ⚙️ CONFIGURATION
// ==========================================
const DB_NAME = "DB"; // Match the database_name in your wrangler.toml
const TABLE_USERS = "users";
const TABLE_ROLES = "user_roles";

type PromptResponse = {
  email?: string;
  username?: string;
  displayName?: string;
  password?: string;
};

// ==========================================
// 🚀 MAIN SCRIPT
// ==========================================
async function main() {
  const args = process.argv.slice(2);
  const isRemote = args.includes("--remote");
  const env = isRemote ? "REMOTE" : "LOCAL";

  console.log(`\n👑 \x1b[33mCreate Admin User [${env}]\x1b[0m\n`);

  // 1. Get Inputs
  const response = (await prompts([
    {
      type: "text",
      name: "email",
      message: "Admin Email:",
      validate: (value) => (value.includes("@") ? true : "Invalid email"),
    },
    {
      type: "text",
      name: "username",
      message: "Username:",
      initial: "admin",
    },
    {
      type: "text",
      name: "displayName",
      message: "Display Name:",
      initial: "Administrator",
    },
    {
      type: "password",
      name: "password",
      message: "Password:",
      validate: (value) => (value.length < (isRemote ? 8 : 0) ? "Must be 8+ chars" : true),
    },
  ])) as PromptResponse;

  if (!response.email || !response.password) {
    console.log("❌ Cancelled");
    process.exit(0);
  }

  console.log("\n⚙️  Generating credentials...");

  // 2. Prepare Data
  const userId = crypto.randomUUID();
  const roleId = crypto.randomUUID();
  const passwordHash = await hashPassword(response.password);
  const now = new Date().toISOString();

  // 3. Generate SQL
  // We use a temporary file because passing complex strings via CLI args is buggy
  const sql = `
    INSERT INTO ${TABLE_USERS} (id, email, username, display_name, password_hash, is_active, email_verified, created_at, updated_at)
    VALUES ('${userId}', '${response.email}', '${response.username}', '${response.displayName}', '${passwordHash}', 1, 1, '${now}', '${now}');

    INSERT INTO ${TABLE_ROLES} (id, user_id, role, assigned_at)
    VALUES ('${roleId}', '${userId}', 'admin', '${now}');
  `;

  const filename = `temp_seed_${Date.now()}.sql`;
  fs.writeFileSync(filename, sql);

  // 4. Execute via Wrangler
  console.log(`🚀 Executing against D1 (${env})...`);

  const flags = isRemote ? ["--remote"] : ["--local"];

  const child = spawn(
    "bunx",
    ["wrangler", "d1", "execute", DB_NAME, ...flags, `--file=${filename}`],
    { stdio: "inherit" }
  );

  child.on("close", (code) => {
    // Cleanup temp file
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }

    if (code === 0) {
      console.log(`\n✅ \x1b[32mSuccess! Admin user created.\x1b[0m`);
      console.log(`   Email: ${response.email}`);
      console.log(`   ID:    ${userId}`);
    } else {
      console.error(`\n❌ Failed to execute SQL.`);
    }
  });
}

void main();

import { db } from "../src/db";
import { inventoryItems } from "../src/index";
import { nanoid } from "nanoid";

async function seedInventoryItems() {
  await db.insert(inventoryItems).values([
    {
      id: nanoid(),
      userId: "dt1ofx4966hax9hp0l46rnw8",
      name: "Projector Epson X123",
      category: "Electronics",
      quantity: 3,
      condition: "Good",
      photoUrl: "https://example.com/projector.jpg",
      isAvailable: true,
    },
    {
      id: nanoid(),
      userId: "dt1ofx4966hax9hp0l46rnw8",
      name: "Laptop Lenovo ThinkPad",
      category: "Computers",
      quantity: 5,
      condition: "Fair",
      photoUrl: "https://example.com/thinkpad.jpg",
      isAvailable: true,
    },
    {
      id: nanoid(),
      userId: "dt1ofx4966hax9hp0l46rnw8",
      name: "Wireless Microphone Set",
      category: "Audio Equipment",
      quantity: 2,
      condition: "Excellent",
      photoUrl: "https://example.com/mic.jpg",
      isAvailable: false,
    },
  ]);

  console.log("Inventory items seeded");
}

seedInventoryItems().catch((e) => {
  console.error("Failed to seed inventory items:", e);
  process.exit(1);
});

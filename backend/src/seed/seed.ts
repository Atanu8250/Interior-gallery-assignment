/**
 * Purpose: Seeds development or local database with initial records.
 * How it is used: Run manually to populate users, tags, and images.
 * Continue here: Idempotent seed routines and fixture dataset definitions.
 */
import { connectDB, disconnectDB } from "../config/db";
import { ImageModel } from "../modules/image/image.model";
import { TagModel } from "../modules/tag/tag.model";
import { CreateTagInput } from "../modules/tag/tag.types";
import { UserModel } from "../modules/user/user.model";
import { CreateUserInput } from "../modules/user/user.types";

type ImageSeed = {
	title: string;
	description: string;
	imageUrl: string;
	tagSlugs: string[];
	userIndex: number;
};

const userSeeds: CreateUserInput[] = [
	{ name: "Maya Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80", bio: "Interior stylist focused on layered, light-filled residential spaces." },
	{ name: "Noah Patel", avatar: "https://images.unsplash.com/photo-500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", bio: "Architectural photographer with a preference for clean geometry and texture." },
	{ name: "Ava Brooks", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80", bio: "Gallery curator sharing contemporary interiors and collectible objects." },
	{ name: "Ethan Rivera", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80", bio: "Designer building warm modern spaces with tactile materials." },
	{ name: "Zoe Kim", avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=200&q=80", bio: "Creative director collecting mood-led rooms and material studies." },
	{ name: "Liam Foster", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80", bio: "Set designer documenting bold forms, artful lighting, and color." },
];

const tagSeeds: CreateTagInput[] = [
	{ name: "Minimal", slug: "minimal" },
	{ name: "Warm", slug: "warm" },
	{ name: "Scandinavian", slug: "scandinavian" },
	{ name: "Industrial", slug: "industrial" },
	{ name: "Modern", slug: "modern" },
	{ name: "Vintage", slug: "vintage" },
	{ name: "Coastal", slug: "coastal" },
	{ name: "Organic", slug: "organic" },
	{ name: "Bold", slug: "bold" },
	{ name: "Neutral", slug: "neutral" },
	{ name: "Moody", slug: "moody" },
	{ name: "Textured", slug: "textured" },
	{ name: "No Data", slug: "no_data" },
];

const imageSeeds: ImageSeed[] = [
	{ title: "Sunlit Studio Living Room with some dummy text", description: "A calm living room with soft curtains and oak shelving.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["minimal", "warm", "neutral"], userIndex: 0 },
	{ title: "Monochrome Dining Nook", description: "A compact dining space with sculptural seating and matte finishes.", imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["modern", "minimal", "textured"], userIndex: 1 },
	{ title: "Gallery Wall Corner", description: "Layered frames and a linen sofa in a gallery-like apartment.", imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["bold", "modern", "neutral"], userIndex: 2 },
	{ title: "Warm Kitchen Detail", description: "Natural stone, wood grain, and soft task lighting in one frame.", imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["warm", "organic", "textured"], userIndex: 3 },
	{ title: "Quiet Bedroom Retreat", description: "A serene bedroom with layered bedding and diffused morning light.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["minimal", "neutral", "moody"], userIndex: 4 },
	{ title: "Concrete Loft Lounge", description: "An industrial living area balanced with leather and plants.", imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["industrial", "moody", "textured"], userIndex: 5 },
	{ title: "Coastal Reading Corner", description: "Breezy tones and relaxed furnishings beside a wide window.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["coastal", "neutral", "warm"], userIndex: 0 },
	{ title: "Bold Accent Hallway", description: "A corridor with saturated color, art, and a rounded mirror.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["bold", "modern", "vintage"], userIndex: 1 },
	{ title: "Textured Lounge Scene", description: "Bouclé, stone, and brushed metal in a tactile sitting room.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["textured", "warm", "organic"], userIndex: 2 },
	{ title: "Neutral Office Corner", description: "A focused workspace with soft neutrals and clean storage.", imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["neutral", "minimal", "modern"], userIndex: 3 },
	{ title: "Moody Library Room", description: "Dark wood shelves and low light create a dramatic reading space.", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["moody", "vintage", "textured"], userIndex: 4 },
	{ title: "Organic Entryway", description: "A grounded entry with clay tones, plants, and handmade pottery.", imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["organic", "warm", "neutral"], userIndex: 5 },
	{ title: "Scandinavian Breakfast Bar", description: "A bright kitchen corner with pale oak and streamlined stools.", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["scandinavian", "minimal", "warm"], userIndex: 0 },
	{ title: "Vintage Lounge Mix", description: "A collected room with curved shapes, layered rugs, and brass accents.", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["vintage", "warm", "bold"], userIndex: 1 },
	{ title: "Modern Shelf Styling", description: "Open shelving styled with books, ceramics, and soft shadows.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["modern", "neutral", "textured"], userIndex: 2 },
	{ title: "Cozy Window Seat", description: "A built-in window nook with cushions and a reading lamp.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["coastal", "warm", "minimal"], userIndex: 3 },
	{ title: "Dark Marble Bath", description: "A moody bath vignette with stone, black fixtures, and reflective light.", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["moody", "modern", "industrial"], userIndex: 4 },
	{ title: "Layered Sofa Scene", description: "A soft, lived-in room focused on texture and comfort.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["warm", "textured", "neutral"], userIndex: 5 },
	{ title: "Terracotta Corner", description: "Earth tones and handmade forms define this simple vignette.", imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["organic", "warm", "vintage"], userIndex: 0 },
	{ title: "Floating Shelves Study", description: "An airy study with repetitive shelving and crisp daylight.", imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["minimal", "modern", "neutral"], userIndex: 1 },
	{ title: "Color Pop Lounge", description: "A playful room anchored by one strong accent wall and art print.", imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["bold", "vintage", "modern"], userIndex: 2 },
	{ title: "Soft Linen Bedroom", description: "A restful bedroom with layered linen and a low profile bed.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["minimal", "neutral", "warm"], userIndex: 3 },
	{ title: "Stone and Wood Kitchen", description: "A refined kitchen with natural surfaces and subtle contrast.", imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["textured", "organic", "modern"], userIndex: 4 },
	{ title: "Retro Seating Vignette", description: "Mid-century shapes and warm tones create a nostalgic feel.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["vintage", "warm", "modern"], userIndex: 5 },
	{ title: "Airy Studio Desk", description: "A neat work surface surrounded by daylight and minimal decor.", imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["scandinavian", "minimal", "neutral"], userIndex: 0 },
	{ title: "Textured Wall Detail", description: "Close-up material study with plaster, wood, and shadow.", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["textured", "moody", "industrial"], userIndex: 1 },
	{ title: "Relaxed Coastal Den", description: "A breezy den where whites, blues, and natural fibers meet.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["coastal", "neutral", "organic"], userIndex: 2 },
	{ title: "Moody Lounge Shelf", description: "A darker composition with stacked books, ceramics, and accent light.", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["moody", "bold", "textured"], userIndex: 3 },
	{ title: "Minimal Bench Corner", description: "A spare corner focused on balance, scale, and natural light.", imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["minimal", "neutral", "scandinavian"], userIndex: 4 },
	{ title: "Warm Fireplace Scene", description: "A layered seating area centered on a soft glow and earthy tones.", imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["warm", "organic", "moody"], userIndex: 5 },
	{ title: "Modern Bathroom Shelf", description: "A clean bath composition with intentional styling and symmetry.", imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["modern", "neutral", "minimal"], userIndex: 0 },
	{ title: "Collected Art Wall", description: "An eclectic arrangement of prints over a low, textured sofa.", imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["vintage", "bold", "textured"], userIndex: 1 },
	{ title: "Organic Dining Table", description: "A handcrafted table setting with warm ceramics and linen.", imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["organic", "warm", "neutral"], userIndex: 2 },
	{ title: "Industrial Window Seat", description: "A loft-style nook framed by metal and raw surfaces.", imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["industrial", "moody", "modern"], userIndex: 3 },
	{ title: "Final Soft Light Room", description: "A balanced interior scene meant to round out the gallery feed.", imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80", tagSlugs: ["warm", "minimal", "neutral"], userIndex: 4 },
];

async function seedDatabase() {
	await connectDB();

	try {
		await Promise.all([
			UserModel.deleteMany({}),
			TagModel.deleteMany({}),
			ImageModel.deleteMany({}),
		]);

		const users = await UserModel.insertMany(userSeeds);
		const tags = await TagModel.insertMany(tagSeeds);

		const tagMap = new Map(tags.map((tag) => [tag.slug, tag]));
		const imagesToInsert = imageSeeds.map((seed, index) => {
			const user = users[seed.userIndex % users.length];
			if (!user) {
				throw new Error(`Missing seeded user for image: ${seed.title}`);
			}
			const relatedTags = seed.tagSlugs.map((slug) => tagMap.get(slug)).filter((val) => val !== undefined);

			return {
				title: seed.title,
				description: seed.description,
				imageUrl: `${seed.imageUrl}&sig=${index + 1}`,
				tags: relatedTags.map((tag) => tag.slug),
				uploaderId: user._id,
				uploaderSnapshot: {
					_id: user._id,
					name: user.name,
					avatar: user.avatar,
				},
			};
		});

		await ImageModel.insertMany(imagesToInsert);

		console.info(`Seed complete: ${users.length} users, ${tags.length} tags, ${imagesToInsert.length} images`);
	} finally {
		await disconnectDB();
	}
}

seedDatabase().catch((error) => {
	console.error("Seeding failed:", error);
	process.exitCode = 1;
});

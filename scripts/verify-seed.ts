import prisma from "../app/lib/prisma.server.js";

async function main() {
  const counts = await prisma.$transaction([
    prisma.trip.count(),
    prisma.expedition.count(),
    prisma.tour.count(),
    prisma.blogPost.count(),
    prisma.fAQ.count(),
    prisma.testimonial.count(),
    prisma.destination.count(),
    prisma.galleryImage.count(),
    prisma.galleryVideo.count(),
    prisma.teamMember.count(),
    prisma.siteSetting.count(),
  ]);

  console.log({
    trip: counts[0],
    expedition: counts[1],
    tour: counts[2],
    blogPost: counts[3],
    faq: counts[4],
    testimonial: counts[5],
    destination: counts[6],
    galleryImage: counts[7],
    galleryVideo: counts[8],
    teamMember: counts[9],
    siteSetting: counts[10],
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

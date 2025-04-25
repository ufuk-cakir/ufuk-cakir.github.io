import { useRef } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";

import NextImage from "next/image";   // ✅ this line *must* be present
// Local Data
import data from "../data/portfolio.json";

export default function Home() {
  // Ref
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    stagger(
      [textOne.current, textTwo.current, textThree.current, textFour.current],
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>{data.name}</title>
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
{/* 👉──--- INTRO SECTION ---──👈 */}
        <div className="laptop:mt-20 mt-10">
          {/* flex row on large screens, column on small */}
          <div className="flex flex-col laptop:flex-row laptop:items-center">
            {/* profile picture */}
            <div>
              <h1
                ref={textOne}
                className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 w-4/5 mob:w-full laptop:w-4/5"
              >
                {data.headerTaglineOne}
              </h1>
              <h1 ref={textTwo} className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2  w-full laptop:w-4/5">
                {data.headerTaglineTwo}
              </h1>
              <h1 ref={textThree} className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2  w-full laptop:w-4/5">
                {data.headerTaglineThree}
              </h1>
              <h1 ref={textFour} className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2  w-full laptop:w-4/5">
                {data.headerTaglineFour}
              </h1>
            </div>



            <NextImage
              src="https://avatars.githubusercontent.com/ufuk-cakir"   // put the file in /public/images
              alt="Profile picture"
              width={500}
              height={500}
              className="rounded mb-4 laptop:mb-0 laptop:mr-6 shrink-0"
              priority
            />

            {/* existing animated headlines */}
          </div>

          <Socials className="mt-2 laptop:mt-5" />
        </div>

{/* ----------  ABOUT SECTION  ---------- */}
<section
  ref={aboutRef}
  className="relative min-h-screen w-full overflow-hidden scroll-mt-20 pt-12 sm:pt-16 lg:pt-24"
>
  {/* ► Background video */}
  <video
    className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none scroll-mt-20 pt-12 lg:pt-24"
    src="/ai-vis-1-small.mp4"   // put the file in /public/videos
    autoPlay
    muted
    loop
    playsInline
  />

  {/* ► Foreground content */}
  <div
    className="relative z-10 h-full grid
               grid-cols-[1fr_auto]          /* two columns */
               grid-rows-[auto_1fr_auto]     /* three rows: headings – spacer – paragraph */
               gap-x-8 gap-y-10
               px-4 sm:px-8 lg:px-16"
  >
    {/* Heading + kicker (row 1 / col 1-2) */}
    <div className="row-start-2 col-start-1 col-span-2">
      <h1 className="text-5xl sm:text-7xl  text-white leading-none">
        {data.aboutHeadline /* e.g. “UNOSAT” */}
      </h1>
      <h2 className="text-3xl sm:text-6xl font-light text-white mt-2">
        {data.aboutSubhead /* e.g. “From Imagery to Impact” */}
      </h2>
    </div>

    {/* Paragraph (row 3 / col 2) */}
    <p className="row-start-7 col-start-2 max-w-md text-white text-lg sm:text-xl font-light mb-6">
      {data.aboutpara}
    </p>
  </div>
</section>

{/* ----------  RESEARCH SECTION  ---------- */}
<section className="mt-28 laptop:mt-40 text-center">
  <h2 className="text-3xl laptop:text-5xl ">
    Want the academic details?
  </h2>
  <p className="mt-4 text-lg opacity-80">
    I keep an updated list of publications, code and write-ups.
  </p>
  <Link href="/research" className="inline-block mt-6">
    <Button type="primary">Explore my research →</Button>
  </Link>
</section>
        <div className="mt-40 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="text-2xl text-bold">Some of my recent Projects</h1>

          <div className="mt-5 laptop:mt-10 grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {data.projects.map((project) => (
              <WorkCard
                key={project.id}
                img={project.imageSrc}
                name={project.title}
                description={project.description}
                onClick={() => window.open(project.url)}
              />
            ))}
          </div>
        </div>

        {/* <div className="mt-10 laptop:mt-30 p-2 laptop:p-0"> */}
        {/*   <h1 className="tablet:m-10 text-2xl text-bold">Services.</h1> */}
        {/*   <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6"> */}
        {/*     {data.services.map((service, index) => ( */}
        {/*       <ServiceCard */}
        {/*         key={index} */}
        {/*         name={service.title} */}
        {/*         description={service.description} */}
        {/*       /> */}
        {/*     ))} */}
        {/*   </div> */}
        {/* </div> */}
        {/* This button should not go into production */}
        {/* {process.env.NODE_ENV === "development" && ( */}
        {/*   <div className="fixed bottom-5 right-5"> */}
        {/*     <Link href="/edit"> */}
        {/*       <Button type="primary">Edit Data</Button> */}
        {/*     </Link> */}
        {/*   </div> */}
        {/* )} */}
        <Footer />
      </div>
    </div>
  );
}

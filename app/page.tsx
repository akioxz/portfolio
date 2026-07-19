"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";

import Projects from "@/components/Projects";
import Stack from "@/components/Stack";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import BeyondTheCode from "@/components/BeyondTheCode";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-4xl flex flex-col gap-14 sm:gap-16 px-4 sm:px-6 pb-10 sm:pb-24 pt-16 sm:pt-20">
        <Hero />

        <Projects />
        <Stack />
        <Education />
        <Certifications />
        <BeyondTheCode />
        <Footer />
      </main>
    </>
  );
}

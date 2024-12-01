import Image from "next/image";
import Header from "@/components/header/header"
import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import HowItWorks from "@/components/Home/HowItWorks";
import Testimonials from "@/components/Home/Testimonials";
import Contact from "@/components/Home/Contact";
import Subscription from "@/components/Home/Subscription";
export default function Home() {
  return (
    <>
      <Header />
      <Hero/>
      {/* <Features/> */}
      {/* <HowItWorks/> */}
      {/* <Testimonials/> */}
      <Contact/>
      <Subscription/>
    </>
  );
}

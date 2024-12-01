import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden py-24 lg:py-32">
        {/* Gradients */}
        {/* <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
        </div> */}
        {/* End Gradients */}
        <div className="relative z-10">
          <div className="container mx-auto py-10 lg:py-16">
            <div className="max-w-2xl text-center mx-auto">
              <p className="text-2xl font-bold"> Revolutionize Your Business</p>
              {/* Title */}
              <div className="mt-5 max-w-full">
                <h1 className="scroll-m-0 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Communication with WhatsApp Business API
                </h1>
              </div>
              {/* End Title */}
              <div className="mt-5 max-w-3xl">
                <p className="text-xl text-muted-foreground">
                Connect with customers, automate responses, and scale your business communications effortlessly.
                </p>
              </div>
              {/* Buttons */}
              <div className="mt-8 gap-3 flex justify-center">
                <Button size={"lg"}>Get started</Button>
                <Button size={"lg"} variant={"outline"}>
                  Learn more
                </Button>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}



// import Link from 'next/link'
// import { ArrowRight } from 'lucide-react'

// export default function Hero() {
//   return (
//     <section className="bg-whatsapp-green dark:bg-whatsapp-dark-green">
//       <div className="container mx-auto px-6 py-16 text-center">
//         <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
//           Revolutionize Your Business Communication with WhatsApp Business API
//         </h1>
//         <p className="mb-8 text-lg font-normal  sm:px-16 lg:text-xl xl:px-48">
//           Connect with customers, automate responses, and scale your business communications effortlessly.
//         </p>
//         <Link
//           href="#contact"
//           className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-whatsapp-green "
//         >
//           Get Started
//           <ArrowRight className="w-5 h-5 ml-2" />
//         </Link>
//       </div>
//     </section>
//   )
// }

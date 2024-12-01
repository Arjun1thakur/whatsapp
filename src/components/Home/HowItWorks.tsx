import Image from 'next/image'

const steps = [
  {
    title: 'Connect Your Account',
    description: 'Link your WhatsApp Business account to our API platform.',
  },
  {
    title: 'Set Up Automations',
    description: 'Create custom chatbots and automated responses for common queries.',
  },
  {
    title: 'Engage with Customers',
    description: 'Start communicating with your customers at scale.',
  },
  {
    title: 'Analyze and Optimize',
    description: 'Use built-in analytics to improve your communication strategy.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-20  ">
      <div className="container mx-auto px-6">
        <h2 className="mb-12 text-3xl font-extrabold text-center ">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start">
                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 mr-4  rounded-full">
                  {index + 1}
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-bold ">{step.title}</h3>
                  <p className="">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="relative h-96 md:h-auto">
            <Image
              src="/img/whatsapp-logo-featured.webp"
              alt="WhatsApp Business API Dashboard"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  )
}


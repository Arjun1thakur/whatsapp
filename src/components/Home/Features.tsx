import { MessageSquare, Users, Bot, BarChart } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Multi-Agent Support',
    description: 'Manage multiple customer conversations simultaneously with ease.',
  },
  {
    icon: Users,
    title: 'Broadcast Messages',
    description: 'Send messages to multiple customers at once for announcements or promotions.',
  },
  {
    icon: Bot,
    title: 'Chatbots & Automation',
    description: 'Set up automated responses and chatbots to handle common inquiries.',
  },
  {
    icon: BarChart,
    title: 'Analytics & Insights',
    description: 'Gain valuable insights into your customer interactions and team performance.',
  },
]

export default function Features() {
  return (
    <section className="py-20 ">
      <div className="container mx-auto px-6">
        <h2 className="mb-12 text-3xl font-extrabold text-center">
          Powerful Features for Your Business
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="flex border p-8 rounded-lg flex-col items-center text-center">
              <feature.icon className="w-8 h-8 mb-4 text-whatsapp-green dark:text-whatsapp-dark-green" />
              <h3 className="mb-2 text-xl font-bold ">{feature.title}</h3>
              <p className="  ">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

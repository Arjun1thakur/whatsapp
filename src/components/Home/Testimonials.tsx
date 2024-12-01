import Image from 'next/image'

const testimonials = [
  {
    quote: "WhatsApp Business API has transformed the way we communicate with our customers. It's efficient, scalable, and our customers love it!",
    author: "Jane Doe",
    company: "Tech Solutions Inc.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    quote: "The automation features have saved us countless hours and improved our response times significantly. Highly recommended!",
    author: "John Smith",
    company: "E-commerce Experts",
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 ">
      <div className="container mx-auto px-6">
        <h2 className="mb-12 text-3xl font-extrabold text-center ">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6  rounded-lg shadow-md">
              <p className="mb-4  italic">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={60}
                  height={60}
                  className="rounded-full mr-4"
                />
                <div>
                  <p className="font-bold ">{testimonial.author}</p>
                  <p className="text-sm ">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


import {NavLink} from "@/components/landing/NavLink";
import {helpTopicsContent} from "@/content/help";

export function HelpTopics() {
  return (
    <section className="bg-white px-6 py-24 sm:px-10 lg:px-30">
      <div className="mx-auto grid max-w-360 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {helpTopicsContent.map((topic) => (
          <article key={topic.id} className="flex flex-col gap-6 rounded-xl border border-grey-200 bg-white p-7" data-node-id={topic.id}>
            <div className="rounded-lg bg-grey-100 p-3">
              <img alt="" className="size-6" src={topic.icon} />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h2 className="font-sans text-lg font-medium leading-[1.2] text-black">{topic.heading}</h2>
                <p className="font-sans text-sm font-normal leading-[1.4] text-grey-600">{topic.body}</p>
              </div>
              <ul className="flex flex-col gap-2">
                {topic.items.map((item) => (
                  <li key={item.href} className="py-0.5">
                    <NavLink className="font-sans text-sm font-medium leading-[1.4] text-primary-500 hover:underline" href={item.href}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

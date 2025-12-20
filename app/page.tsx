import Approach from "@/components/Approach";
import Clients from "@/components/Clients";
import Footer from "@/components/Footer";
import Grid from "@/components/Grid";
import Hero from "@/components/Hero";
import RecentProjects from "@/components/RecentProjects";
import { FloatingDock } from "@/components/ui/FloatingDeck";
import {
  IconHome,
  IconBrandGithub,
  IconBrandX,
  IconMail,
  IconBrandLinkedin,
  IconBrandInstagram,
   IconUser,           // About
  IconCode,           // Projects
  IconMessageCircle,  // Testimonials
  IconAddressBook,
} from "@tabler/icons-react";
export default function Home() {
  return (
    <main className="relative bg-black-100 flex flex-col items-center justify-center mx-auto sm:px-10 px-5 overflow-clip">
      <div className="max-w-7xl w-full">
        <FloatingDock
          topCentered={true}
          desktopClassName="z-60 mt-6"
          mobileClassName="fixed bottom-24 right-4 z-[999] shadow=2xl"
          items={[
            {
              title: "Home",
              icon: <IconHome className="h-5 w-5 text-gray-300" stroke={1.5} />,
              href: "#home",
            },{
              title: "About",
              icon: <IconUser className="h-5 w-5 text-gray-300" stroke={1.5} />,
              href: "#about",
            },{
              title: "Projects",
              icon: <IconCode className="h-5 w-5 text-gray-300" stroke={1.5} />,
              href: "#projects",
            },{
              title: "Testimonials",
              icon: <IconMessageCircle className="h-5 w-5 text-gray-300" stroke={1.5} />,
              href: "#testimonials",
            },{
              title: "Contacts",
              icon: <IconAddressBook className="h-5 w-5 text-gray-300" stroke={1.5} />,
              href: "#contacts",
            },
            

            {
              title: "Github",
              icon: (
                <IconBrandGithub
                  className="h-5 w-5 text-gray-300"
                  stroke={1.5}
                />
              ),
              href: "https://github.com/Phani2603",
            },
            {
              title: "LinkedIn",
              icon: (
                <IconBrandLinkedin
                  className="h-5 w-5 text-gray-300"
                  stroke={1.5}
                />
              ),
              href: "https://www.linkedin.com/in/srikar2603",
            },
            {
              title: "Mail",
              icon: (
                <IconMail className="h-5 w-5 text-gray-300" stroke={1.5} />
              ),
              href: "https://mail.google.com/mail/?view=cm&fs=1&to=kusumbaphanisrikar@gmail.com",
            },

            {
              title: "Twitter",
              icon: (
                <IconBrandX className="h-5 w-5 text-gray-300" stroke={1.5} />
              ),
              href: "https://twitter.com/vegeta30451",
            },
            {
              title: "Instagram",
              icon: (
                <IconBrandInstagram
                  className="h-5 w-5 text-gray-300"
                  stroke={1.5}
                />
              ),
              href: "https://www.instagram.com/srikar2603",
            },
          ]}
        />
        <Hero />
        <Grid/>
        <RecentProjects/>
        <Clients/>
        {/* <Experience/> */}
        <Approach/>
        <Footer/>
      </div>
    </main>
  );
}

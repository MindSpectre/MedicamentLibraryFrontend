import Image from 'next/image'
import React from "react";
import Globe from "@/components/ui/globe";
import {
    BellIcon,
    CalendarIcon,
    FileTextIcon,
    GlobeIcon,
    InputIcon,
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const features = [
    {
        Icon: FileTextIcon,
        name: "Save your files",
        description: "We automatically save your files as you type.",
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:row-start-1 lg:row-end-2 lg:col-start-2 lg:col-end-3 flex border",
    },
    {
        Icon: InputIcon,
        name: "Full text search",
        description: "Search through all your files in one place.",
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20 -top-40 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2 border",
    },
    {
        Icon: GlobeIcon,
        name: "Multilingual",
        description: "Supports 100+ languages and counting.",
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3 border",
    },
    {
        Icon: CalendarIcon,
        name: "Calendar",
        description: "Use the calendar to filter your files by date.",
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20 -top-20 opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-1 border",
    },
    {
        Icon: BellIcon,
        name: "Notifications",
        description:
            "Get notified when someone shares a file or mentions you in a comment.",
        href: "/",
        cta: "Learn more",
        background: <img className="absolute -right-20  opacity-60" />,
        className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-2 border",
    },
];

export default function Home() {
  return (
      <div className="container mx-auto p-4 flex-col h-dvh">
          <h2 className="text-center text-8xl font-bold mb-4">Welcome to MedicamentLibrary</h2>
          <p className="text-center text-wrap text-4xl mb-8">Your comprehensive resource for medicaments, diseases, patients, and organizations.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div
                  className="relative bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden"
                  style={{
                      backgroundImage: "url('/images/disease2.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "300px"
                  }}
              >
                  {/* Optional Dark Overlay for Better Text Contrast */}
                  <div className="absolute inset-0 bg-black/30"></div>

                  {/* Content Layer */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
                      <h3 className="text-3xl font-bold mb-2">Diseases</h3>
                      <p className="text-center">
                          Explore our extensive database of diseases and conditions.
                      </p>
                  </div>
              </div>


              <div
                  className="relative bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden"
                  style={{
                      backgroundImage: "url('/images/drug.png')", // Set the background image
                      backgroundSize: "cover", // Make the background cover the entire div
                      backgroundPosition: "center", // Center the image
                      height: "300px" // Adjust height to fit your needs
                  }}
              >
                  <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
                  {/* Optional dark overlay */}
                  <div className="relative flex flex-col items-center justify-center h-full text-white">
                      <h3 className="text-3xl font-semibold mb-2">Medicaments</h3>
                      <p className="text-center">Discover a wide range of medicaments and their applications</p>
                  </div>
              </div>


              <div
                  className="relative bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden"
                  style={{
                      backgroundImage: "url('/images/medical_history.png')", // Set the background image
                      backgroundSize: "cover", // Make the background cover the entire div
                      backgroundPosition: "center", // Center the image
                      height: "300px" // Adjust height to fit your needs
                  }}
              >
                  <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
                  {/* Optional dark overlay */}
                  <div className="relative flex flex-col items-center justify-center h-full text-white">
                      <h3 className="text-3xl font-semibold mb-2">Patients</h3>
                      <p className="text-center">Manage patient information and medical histories.</p>
                  </div>
              </div>
              <div
                  className="relative bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden"
                  style={{
                      backgroundImage: "url('/images/princeton_plainsboro.png')", // Set the background image
                      backgroundSize: "cover", // Make the background cover the entire div
                      backgroundPosition: "center", // Center the image
                      height: "300px" // Adjust height to fit your needs
                  }}
              >
                  <div className="absolute inset-0 bg-black/50 rounded-lg"></div>
                  {/* Optional dark overlay */}
                  <div className="relative flex flex-col items-center justify-center h-full text-white">
                      <h3 className="text-3xl font-semibold mb-2">Organizations</h3>
                      <p className="text-center">Connect with healthcare organizations and institutions.</p>
                  </div>
              </div>
          </div>
          <BentoGrid className="lg:grid-rows-3 h-svh">
              {features.map((feature) => (
                  <BentoCard key={feature.name} {...feature} />
              ))}
          </BentoGrid>
      </div>

  )
}


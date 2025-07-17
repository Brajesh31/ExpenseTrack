"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FlipWords } from "@/components/ui/flip-words";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Github } from "lucide-react";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { useTheme } from "next-themes";

const HomePage = () => {
  const words = ["expenses", "budgets", "savings"];
  const theme = useTheme();
  const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";


  return (
    <div>
      <ToastContainer />
      <div className="h-screen w-full relative overflow-hidden flex flex-col">
        {/* Background with grid pattern and gradient */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"
          style={{
            backgroundImage: `
            linear-gradient(to bottom right, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1)),
            linear-gradient(rgba(34, 197, 94, 0.05) 2px, transparent 2px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.05) 2px, transparent 2px)
          `,
            backgroundSize: "100% 100%, 20px 20px, 20px 20px",
          }}
        />

        {/* Main Content */}
        <div className="relative z-10 flex flex-col flex-grow">
          {/* Navigation */}
          <nav className="py-6 px-8 flex-shrink-0">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">ExpanseTrack</h1>
              </div>
              <div className="space-x-4">
                <Link href="/about" passHref>
                  <Button variant="ghost" asChild>
                    <span>About</span>
                  </Button>
                </Link>
                <a
                  href="https://github.com/Brajesh31/ExpenseTrack"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="bg-gray-800 text-white hover:bg-gray-700">
                    <span>GitHub</span>
                    <Github className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <section className="flex items-center justify-center flex-grow px-8">
            <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
              <h2 className="text-6xl font-bold text-gray-900 mb-6">
                Track Your {" "}
                <span className="text-indigo-600">
                  <FlipWords words={words} />
                </span>{" "}
                <br />
                Efficiently with {" "}
                <span className="text-indigo-600">
                  <LineShadowText className="italic" shadowColor={shadowColor}>
                    ExpanseTrack
                  </LineShadowText>
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Take control of your financial journey. Visualize, track, and manage your expenses seamlessly.
              </p>
              <div className="space-x-4">
                <InteractiveHoverButton onClick={()=>window.location.href="/home"}>Get Started</InteractiveHoverButton>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-base text-gray-600 py-4 flex-shrink-0">
            <p>
              © 2025 ExpanseTrack. {" "}
               Contribute on {" "}
              <a
                href="https://github.com/Brajesh31/ExpenseTrack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub
              </a>
              .
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import messages from "../data/transcription.json";
import audio from "../data/audio.wav";
import type { Message } from "@/types";

function Transcription() {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = React.useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const isUser = (role: string) => role === "user";

  const handleClick = (time: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    audioRef.current.play();

    // set the progress bar to the current time
    setProgress(time);
  };

  const handleTime = (event: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    setProgress(event.currentTarget.currentTime);

    // find the current message
    const newMatch = messages.find(
      (message) =>
        message.start <= event.currentTarget.currentTime &&
        message.end >= event.currentTarget.currentTime
    );

    // scroll to the current message when the audio is playing and user is not scrolling
    if (!isScrolling) {
      const currentMessage = document.getElementById(
        newMatch?.start.toString() ?? ""
      );
      if (currentMessage) {
        currentMessage.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const currentAudioRef = audioRef.current;

    currentAudioRef.addEventListener("ended", () => {
      setProgress(0);
    });

    return () => {
      currentAudioRef.removeEventListener("ended", () => {
        setProgress(0);
      });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      setScrollTimeout(setTimeout(() => setIsScrolling(false), 2000));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <section className="grid gap-5 px-3">
      <div>
        {(messages as Message[]).map((message) => (
          <div
            className="grid gap-2 mb-4 last-of-type:mb-0"
            key={message.start}
          >
            <button
              id={message.start.toString()}
              type="button"
              onClick={() => handleClick(message.start)}
              className={`flex rounded-lg text-left w-fit max-w-[90%] transition-all duration-300 ease-in-out ${
                isUser(message.role)
                  ? "justify-self-end bg-neutral-900/50 rounded-br-none mr-4"
                  : "justify-self-start bg-neutral-700/50 rounded-bl-none ml-4"
              } 
            ${
              progress >= message.start && progress < message.end
                ? "scale-100"
                : "scale-95"
            }
          `}
            >
              <span className="p-4 text-white">{message.content}</span>
            </button>
            <div
              className={`${
                isUser(message.role) ? "justify-self-end" : "justify-self-start"
              }`}
            >
              <Image
                src="https://via.placeholder.com/50"
                alt="Profile Picture"
                width={50}
                height={50}
                className="rounded-full border-2 border-white"
              />
            </div>
          </div>
        ))}
      </div>
      <audio
        ref={audioRef}
        controls
        className="w-full sm:w-96 mx-auto sticky bottom-4"
        onTimeUpdate={handleTime}
      >
        <source src={audio} type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </section>
  );
}

export default Transcription;

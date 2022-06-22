import { FC, useEffect, useRef, useState } from "react"

interface Props {
  message?: string;
}

export const LoadingIndicator: FC<Props> = ({ message }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const startEpoch = Date.now()
    const intervalId = setInterval(() => {
      setElapsedSeconds(Math.round((Date.now() - startEpoch) / 1000));
    }, 1000);
    return () => {
      clearInterval(intervalId)
    };
  }, []);
  return (
    <div className="app-loading">
      <p>
        Loading...
      </p>
      <p>
        Elapsed: {elapsedSeconds}
      </p>
      { message && (
        <p>
          Message: {message}
        </p>
      )}
    </div>
  )
}
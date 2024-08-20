import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

interface AuthContextProps {
  isAuthenticated: boolean;
  role: "admin" | "member";
  username: string;
  score: number;
  answeredQuestions: string[];
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setRole: (role: "admin" | "member") => void;
  setUsername: (username: string) => void;
  setScore: (score: number) => void;
  setAnsweredQuestions: (questionIds: string[]) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Load initial state from localStorage or use defaults
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(() => {
    const storedAuth = localStorage.getItem("isAuthenticated");
    return storedAuth ? JSON.parse(storedAuth) : false;
  });

  const [roleState, setRoleState] = useState<"admin" | "member">(() => {
    const storedRole = localStorage.getItem("role");
    return storedRole
      ? (JSON.parse(storedRole) as "admin" | "member")
      : "member";
  });

  const [usernameState, setUsernameState] = useState(() => {
    const storedUsername = localStorage.getItem("username");
    return storedUsername ? JSON.parse(storedUsername) : "";
  });

  const [scoreState, setScoreState] = useState(() => {
    const storedScore = localStorage.getItem("score");
    return storedScore ? JSON.parse(storedScore) : 0;
  });

  const [answeredQuestionsState, setAnsweredQuestionsState] = useState(() => {
    const storedAnsweredQuestions = localStorage.getItem("answeredQuestions");
    return storedAnsweredQuestions ? JSON.parse(storedAnsweredQuestions) : [];
  });


  // Update localStorage whenever the auth state changes
  useEffect(() => {
    localStorage.setItem(
      "isAuthenticated",
      JSON.stringify(isAuthenticatedState)
    );
  }, [isAuthenticatedState]);

  useEffect(() => {
    localStorage.setItem("role", JSON.stringify(roleState));
  }, [roleState]);

  useEffect(() => {
    localStorage.setItem("username", JSON.stringify(usernameState));
  }, [usernameState]);

  useEffect(() => {
    localStorage.setItem("score", JSON.stringify(scoreState));
  }, [scoreState]);

  useEffect(() => {
    localStorage.setItem("answeredQuestions", JSON.stringify(answeredQuestionsState));
  }, [answeredQuestionsState]);

  // Wrapper functions to set state and update localStorage
  const setIsAuthenticated = (isAuthenticated: boolean) => {
    setIsAuthenticatedState(isAuthenticated);
  };

  const setRole = (role: "admin" | "member") => {
    setRoleState(role);
  };

  const setUsername = (username: string) => {
    setUsernameState(username);
  };

  const setScore = (score: number) => {
    setScoreState(score);
  };

  const setAnsweredQuestions = (questionIds: string[]) => {
    setAnsweredQuestionsState((initialQuestionIds: string[]) => (
      [ ...initialQuestionIds,
        ...questionIds
      ]
    ));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticatedState,
        role: roleState,
        username: usernameState,
        score: scoreState,
        answeredQuestions: answeredQuestionsState,
        setIsAuthenticated,
        setRole,
        setUsername,
        setScore,
        setAnsweredQuestions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

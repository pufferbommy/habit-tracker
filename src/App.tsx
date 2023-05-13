import {
  Typography,
  Box,
  Container,
  Checkbox,
  alpha,
  Popover,
  TextField,
  Button,
} from "@mui/material";
import { MouseEvent, useEffect, useMemo, useState } from "react";
import red from "@mui/material/colors/red";

const MAX_DAYS = 31;

interface Date {
  date: number;
  isDone: boolean;
}

interface Habit {
  id: string;
  name: string;
  dates: Date[];
}

function App() {
  const [editedHabit, setEditedHabit] = useState<Habit | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const [habits, setHabits] = useState<Habit[]>(initializeHabits);

  function getInitialDates() {
    return Array.from({ length: MAX_DAYS }, (_, i) => {
      return {
        date: i + 1,
        isDone: false,
      };
    });
  }

  function initializeHabits(): Habit[] {
    const defaultHabits = [
      {
        id: "1",
        name: "",
        dates: getInitialDates(),
      },
      {
        id: "2",
        name: "",
        dates: getInitialDates(),
      },
      {
        id: "3",
        name: "",
        dates: getInitialDates(),
      },
    ];

    const storedHabits = localStorage.getItem("habits");

    if (!storedHabits) {
      localStorage.setItem("habits", JSON.stringify(defaultHabits));
      return defaultHabits;
    }

    const parsedStoredHabits = JSON.parse(storedHabits);

    if (!Array.isArray(parsedStoredHabits)) {
      localStorage.setItem("habits", JSON.stringify(defaultHabits));
      return defaultHabits;
    }

    return parsedStoredHabits;
  }

  function handleHabbitNameClick(e: MouseEvent<HTMLDivElement>, habit: Habit) {
    setAnchorEl(e.currentTarget);
    setEditedHabit(habit);
  }

  function handleClose() {
    setAnchorEl(null);
    setEditedHabit(null);
  }

  function handleSave() {
    setHabits((prev) => {
      return prev.map((habit) => {
        return habit.id === editedHabit?.id ? editedHabit : habit;
      });
    });
    handleClose();
  }

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  return (
    <Container>
      <Box py={8} color="white">
        <Typography
          fontWeight={700}
          variant="h1"
          gutterBottom
          fontSize={64}
          marginLeft={-0.5}
        >
          Habit Tracker 🦉
        </Typography>
        <Box display="flex">
          <Box display="flex" flexDirection="column" width={150}>
            <Typography fontWeight={700}>Habit</Typography>
            <Box height="100%" display="flex" flexDirection="column">
              {habits.map((habit) => (
                <Box
                  sx={{
                    cursor: "pointer",
                    borderRadius: 2,
                    backgroundColor:
                      habit.id === editedHabit?.id ? alpha(red[300], 0.25) : "",
                    backdropFilter:
                      habit.id === editedHabit?.id ? "blur(4px)" : "",
                    paddingX: habit.id === editedHabit?.id ? 2 : "",
                    transitionProperty:
                      "background-color, backdrop-filter, padding",
                    transitionDuration: "350ms, 700ms, 350ms",
                    ":hover": {
                      backgroundColor: alpha(red[300], 0.25),
                      backdropFilter: "blur(4px)",
                      paddingX: 2,
                    },
                  }}
                  onClick={(e) => handleHabbitNameClick(e, habit)}
                  display="flex"
                  alignItems="center"
                  key={habit.id}
                  height="100%"
                >
                  <Typography
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    overflow="hidden"
                  >
                    {habit.name || "🥹 Empty"}
                  </Typography>
                </Box>
              ))}
              <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <Box padding={2}>
                  <TextField
                    minRows={2}
                    value={editedHabit?.name}
                    onChange={(e) => {
                      setEditedHabit((prev) => {
                        return { ...prev, name: e.target.value } as Habit;
                      });
                    }}
                    multiline
                    label="Your habit"
                    variant="outlined"
                  />
                  <Box display="flex" flexDirection="column" gap={1} mt={2}>
                    <Button
                      onClick={handleClose}
                      fullWidth
                      color="error"
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      fullWidth
                      color="success"
                      variant="outlined"
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
              </Popover>
            </Box>
          </Box>
          <Box display="flex" width="100%">
            {Array.from({ length: MAX_DAYS }, (_, i) => (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                key={i + 1}
                flexGrow={1}
                flexBasis="auto"
                flexShrink={0}
              >
                <Typography fontWeight={700}>{i + 1}</Typography>
                <Box display="flex" flexDirection="column">
                  {habits.map((habit, j) => (
                    <Checkbox
                      key={habit.id + j}
                      sx={{
                        paddingX: 0.5,
                        paddingY: 2,
                        color: red[50],
                        "&.Mui-checked": {
                          color: red[100],
                        },
                      }}
                      checked={habit.dates[i].isDone}
                      onChange={(e) => {
                        setHabits((prev) => {
                          const newHabbits = [...prev];
                          newHabbits[j].dates[i].isDone = e.target.checked;
                          return newHabbits;
                        });
                      }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default App;

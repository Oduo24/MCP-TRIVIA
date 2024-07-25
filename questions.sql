-- Insert episodes
INSERT INTO episodes (name) VALUES ('Episode 1');
INSERT INTO episodes (name) VALUES ('Episode 2');
INSERT INTO episodes (name) VALUES ('Episode 3');

-- Insert questions and randomly assign episodes
INSERT INTO questions (question_text, episode_id) VALUES ('What is the capital of France?', (SELECT id FROM episodes ORDER BY RANDOM() LIMIT 1));
INSERT INTO questions (question_text, episode_id) VALUES ('What is 2 + 2?', (SELECT id FROM episodes ORDER BY RANDOM() LIMIT 1));
INSERT INTO questions (question_text, episode_id) VALUES ('Who wrote "To Kill a Mockingbird"?', (SELECT id FROM episodes ORDER BY RANDOM() LIMIT 1));
INSERT INTO questions (question_text, episode_id) VALUES ('What is the speed of light?', (SELECT id FROM episodes ORDER BY RANDOM() LIMIT 1));
INSERT INTO questions (question_text, episode_id) VALUES ('What is the boiling point of water?', (SELECT id FROM episodes ORDER BY RANDOM() LIMIT 1));

-- Insert answers for each question
-- Answers for "What is the capital of France?"
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('Paris', TRUE, (SELECT id FROM questions WHERE question_text = 'What is the capital of France?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('London', FALSE, (SELECT id FROM questions WHERE question_text = 'What is the capital of France?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('Berlin', FALSE, (SELECT id FROM questions WHERE question_text = 'What is the capital of France?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('Madrid', FALSE, (SELECT id FROM questions WHERE question_text = 'What is the capital of France?'));

-- Answers for "What is 2 + 2?"
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('3', FALSE, (SELECT id FROM questions WHERE question_text = 'What is 2 + 2?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('4', TRUE, (SELECT id FROM questions WHERE question_text = 'What is 2 + 2?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('5', FALSE, (SELECT id FROM questions WHERE question_text = 'What is 2 + 2?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('6', FALSE, (SELECT id FROM questions WHERE question_text = 'What is 2 + 2?'));

-- Answers for "Who wrote 'To Kill a Mockingbird'?"
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('Harper Lee', TRUE, (SELECT id FROM questions WHERE question_text = 'Who wrote ''To Kill a Mockingbird''?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('Mark Twain', FALSE, (SELECT id FROM questions WHERE question_text = 'Who wrote ''To Kill a Mockingbird''?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('J.K. Rowling', FALSE, (SELECT id FROM questions WHERE question_text = 'Who wrote ''To Kill a Mockingbird''?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('Jane Austen', FALSE, (SELECT id FROM questions WHERE question_text = 'Who wrote ''To Kill a Mockingbird''?'));

-- Answers for "What is the speed of light?"
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('299,792,458 m/s', TRUE, (SELECT id FROM questions WHERE question_text = 'What is the speed of light?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('150,000,000 m/s', FALSE, (SELECT id FROM questions WHERE question_text = 'What is the speed of light?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('30,000,000 m/s', FALSE, (SELECT id FROM questions WHERE question_text = 'What is the speed of light?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('300,000,000 m/s', FALSE, (SELECT id FROM questions WHERE question_text = 'What is the speed of light?'));

-- Answers for "What is the boiling point of water?"
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('100°C', TRUE, (SELECT id FROM questions WHERE question_text = 'What is the boiling point of water?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('90°C', FALSE, (SELECT id FROM questions WHERE question_text = 'What is the boiling point of water?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('110°C', FALSE, (SELECT id FROM questions WHERE question_text = 'What is the boiling point of water?'));
INSERT INTO answers (answer_text, is_correct, question_id) VALUES ('120°C', FALSE, (SELECT id FROM questions WHERE question_text = 'What is the boiling point of water?'));


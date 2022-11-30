CREATE TABLE Users (
       user_id int NOT NULL AUTO_INCREMENT,
       username varchar(255) NOT NULL,
       first_name varchar(255) NOT NULL,
       last_name varchar(255) NOT NULL,
       password varchar(255) NOT NULL,
       email varchar(255) NOT NULL,
       profile_picture varchar(255) NOT NULL,
       account_status varchar(255) NOT NULL,
       is_admin boolean NOT NULL,
       account_created_time DATETIME NOT NULL,
       PRIMARY KEY (user_id),
       UNIQUE (username, email)
);

CREATE TABLE StatusChanges (
       user_id int NOT NULL,
       time datetime NOT NULL,
       status_change varchar(255) NOT NULL,
       PRIMARY KEY (user_id, time),
       FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Posts (
       post_id int NOT NULL AUTO_INCREMENT,
       post_user_id int NOT NULL,
       post_title varchar(255) NOT NULL,
       post_picture varchar(255) NOT NULL,
       post_text varchar(255) NOT NULL,
       is_visible boolean NOT NULL,
       is_global boolean NOT NULL,
       post_created_time datetime NOT NULL,
       post_updated_time datetime NOT NULL,
       PRIMARY KEY (post_id),
       FOREIGN KEY (post_user_id) REFERENCES Users(user_id)       
);

CREATE TABLE Groups (
       group_id int NOT NULL AUTO_INCREMENT,
       group_user_id int NOT NULL,
       group_name varchar(255) NOT NULL,
       group_priority varchar(255) NOT NULL,
       post_created_time datetime NOT NULL,
       post_updated_time datetime NOT NULL,
       PRIMARY KEY (group_id),
       FOREIGN KEY (group_user_id) REFERENCES Users(user_id)       
);

CREATE TABLE Reactions (
       user_id int NOT NULL,
       post_id int NOT NULL,
       reaction_score int NOT NULL,
       reaction_created_time datetime NOT NULL,
       reaction_updated_time datetime NOT NULL,
       PRIMARY KEY (user_id, post_id),
       FOREIGN KEY (user_id) REFERENCES Users(user_id),
       FOREIGN KEY (post_id) REFERENCES Posts(post_id)       
);

CREATE TABLE AlgorithmScores (
       user_id int NOT NULL,
       post_id int NOT NULL,
       algorithm_score int NOT NULL,
       PRIMARY KEY (user_id, post_id),
       FOREIGN KEY (user_id) REFERENCES Users(user_id),
       FOREIGN KEY (post_id) REFERENCES Posts(post_id)       
);

CREATE TABLE Friends (
       initiator_user_id int NOT NULL,
       receiver_user_id int NOT NULL,
       action_type varchar(255) NOT NULL,
       friend_status varchar(255) NOT NULL,
       friend_created_time datetime NOT NULL,
       friend_updated_time datetime NOT NULL,
       PRIMARY KEY (initiator_user_id, receiver_user_id),
       FOREIGN KEY (initiator_user_id) REFERENCES Users(user_id),
       FOREIGN KEY (receiver_user_id) REFERENCES Users(user_id)      
);

CREATE TABLE Sessions (
       user_id int NOT NULL,
       session_uuid varchar(255) NOT NULL,
       PRIMARY KEY (user_id),
       FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE PostVisibility (
       group_id int NOT NULL,
       post_id int NOT NULL,
       PRIMARY KEY (group_id, post_id),
       FOREIGN KEY (group_id) REFERENCES Groups(group_id),
       FOREIGN KEY (post_id) REFERENCES Posts(post_id)       
);

CREATE TABLE GroupMembership (
       group_id int NOT NULL,
       user_id int NOT NULL,
       PRIMARY KEY (group_id, user_id),
       FOREIGN KEY (group_id) REFERENCES Groups(group_id),
       FOREIGN KEY (user_id) REFERENCES Users(user_id)       
);

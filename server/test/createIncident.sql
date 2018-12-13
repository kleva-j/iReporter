DELETE FROM incidents;

INSERT INTO incidents(createdby,  type,  location, images, videos, comment) VALUES(1, 'red-flag', '1.0000, 1.0000', '{image.jpg, image.jpg}', '{video.mp4, video.mp4}', 'This is the first incident');

INSERT INTO incidents(createdby,  type,  location, images, videos, comment) VALUES(2, 'intervention', '2.0000, 2.0000', '{image.png, image.png}', '{video.mkv, video.mkv}', 'This is the second incident');

INSERT INTO incidents(createdby,  type,  location, images, videos, comment) VALUES(3, 'red-flag', '3.0000, 3.0000', '{image.jpeg, image.jpeg}', '{video.avi, video.avi}', 'This is the third incident');
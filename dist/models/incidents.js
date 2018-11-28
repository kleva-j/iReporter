'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var incidents = [{
  id: 1,
  createdOn: new Date(),
  createdBy: 1,
  type: 'red-flag',
  location: '7.03944, 7.35474',
  status: 'draft',
  images: [],
  videos: [],
  comment: ''
}, {
  id: 2,
  createdOn: new Date(),
  createdBy: 2,
  type: 'intervention',
  location: '6.5244° N, 3.3792° E',
  status: 'under investigation',
  images: ['https://static.pulse.ng/img/incoming/origs7532087/2036362149-w644-h960/babachir-lawal.jpg', 'https://instagram.fabb1-1.fna.fbcdn.net/vp/62ed40a3f8197d264937708576124b62/5BFEAE80/t51.2885-15/e15/44689391_1959840454320499_7442477059859311756_n.jpg'],
  videos: ['https://instagram.fabb1-1.fna.fbcdn.net/vp/548aafc3700446d5546adb987bba903d/5BFE8FC9/t50.2886-16/46368990_2010137282342213_8367336152264343552_n.mp4'],
  comment: 'Man climbs high tension pole without making use of a ladder and got electrocuted'
}, {
  id: 3,
  createdOn: new Date(),
  createdBy: 3,
  type: 'red-flag',
  location: '9.0820° N, 8.6753° E',
  status: 'resolved',
  images: ['https://static.pulse.ng/img/incoming/origs9137471/709636868-w644-h960/A-man-proves-that-he-is-quite-skillful-with-climbing-in-a-clip-that-shows-him-mounting-a-pole.png'],
  videos: [],
  comment: '3 siblings nabbed over alleged kidnap of Church member’s daughter'
}];

exports.default = incidents;
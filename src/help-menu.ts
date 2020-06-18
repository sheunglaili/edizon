import { Instruction } from "./component/HelpMenu";

export default [
  {
    primary: "Clear the canvas",
    secondary: "Clear the canvas for your next operation",
    action: "clear",
  },
  {
    primary: "Grayscale the photo",
    secondary: "Turn the photo into grayscale",
    action: "grayscale",
  },
  {
    primary: "Invert",
    secondary: "Invert the color of the photo",
    action: "invert",
  },
  {
    primary: "Pixelate with thirty block size",
    secondary: "Turn your photo into a pixel image with specified block size",
    action: "pixelate",
    entities: [
      {
        name: "Block size",
        key: "grid_size:size",
        description: "The block size you wanna apply to the canvas",
        required: false,
      },
    ],
  },

  {
    primary: "Apply Filter 'name'",
    secondary: "Apply the filter to canvas",
    action: "apply_filter",
    entities: [
      {
        name: "Filter name",
        key: "vedit_filter:vedit_filter",
        description: "The filter name you wanna apply to the canvas",
        required: true,
        select: [
          "lark",
          "reyes",
          "juno",
          "slumber",
          "crema",
          "ludwig",
          "aden",
          "perpetua",
          "amaro",
          "mayfair",
          "rise",
          "hudson",
          "valencia",
          "xpro2",
          "sierra",
          "willow",
          "lofi",
          "earlybird",
          "brannan",
          "hefe",
          "nashville",
          "sutro",
          "toaster",
          "walden",
          "1977",
          "kelvin",
        ],
      },
    ],
  },
  {
    primary: "Blur my background by five",
    secondary: "Set background blurriness of photo to value you ask for",
    action: "blur_background",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to increase",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Set blurriness to five",
    secondary: "Set blurriness of photo to value you ask for",
    action: "set_blurriness",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to increase",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Increase Blurriness by five",
    secondary: "Increase blurriness of photo by value you ask for",
    action: "increase_blurriness",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to increase",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Decrease Blurriness by five",
    secondary: "Decrease blurriness of photo by value you ask for",
    action: "decrease_blurriness",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to decrease",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Set Brightness to twenty",
    secondary: "Set Brightness of photo to value you ask for",
    action: "set_brightness",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to set , range from -100 to 100",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Increase Brightness by thirty",
    secondary: "Increase Brightness of photo by value you ask for",
    action: "increase_brightness",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to increase",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Decrease Brightness by six",
    secondary: "Decrease Brightness of photo by value you ask for",
    action: "decrease_brightness",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to decrease",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Set Contrast to twenty",
    secondary: "Set Contrast of photo to value you ask for",
    action: "set_contrast",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to set , range from -100 to 100",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Increase Contrast by thirty",
    secondary: "Increase Contrast of photo by value you ask for",
    action: "increase_contrast",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to increase",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Decrease Contrast by six",
    secondary: "Decrease Contrast of photo by value you ask for",
    action: "decrease_contrast",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to decrease",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "warmer by six",
    secondary: "Increase warmness of photo by value you ask for",
    action: "warmer",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to increase",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Cooler by seven",
    secondary: "Increase coldness of photo by value you ask for",
    action: "cooler",
    entities: [
      {
        name: "Percentage",
        key: "wit$number:number",
        description: "The percentage you want to increase",
        type: "number",
        required: true,
      },
    ],
  },
  {
    primary: "Undo last filter",
    secondary: "undo the last filter you've apply",
    action: "undo",
  },
  {
    primary: "Reset filter",
    secondary: "clear all filters applied to image",
    action: "reset_filters",
  },
  {
    primary: "Export the image to 'file format'",
    secondary: "Currently support png & jpeg",
    action: "export_image",
    entities: [
      {
        name: "format",
        key: "file_format:format",
        description: "File format that your image export to",
        default: "png",
        required: false,
        select: ["png", "jpeg"],
      },
    ],
  },
] as Instruction[];

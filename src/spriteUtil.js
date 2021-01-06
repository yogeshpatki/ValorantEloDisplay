
const rankCoordinates = {  "3": [0,0],   "4": [0,1],    "5": [0,2],    //IRON 
                           "6": [1,0],    "7": [1,1],    "8": [1,2],    //BRONZE
                           "9": [2,0],    "10": [2,1],    "11": [2,2],    //SILVER
                           "12": [3,0],    "13": [3,1],    "14": [3,2],    //GOLD
                           "15": [4,0],    "16": [4,1],    "17": [4,2],    //PLAT
                           "18": [5,0],    "19": [5,1],    "20": [5,2],    //DIAMOND
                           "21": [6,0],    "22": [6,1],    "23": [6,2],    //IMMORTAL
                           "24": [0,0]  
                        };
export const getSpriteCoordinate = (rank, w, h) => {
  try{
      const coord = rankCoordinates[rank];
      return `-${w*coord[0]}px -${h*coord[1]}px`;
  } catch(e){
      
  };
};
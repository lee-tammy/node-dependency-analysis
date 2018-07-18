import * as acorn from 'acorn';
export interface SearchValue {
  http: boolean;
}

let tokenArray: acorn.Token[] = [];
let b = false;
export async function search(file: string): Promise<any> {
  console.log('...searching...');
  const a = await acorn.parse(file, {
      onToken: tokenArray
  });
 //console.log(tokenArray);
 tokenArray.forEach((token) => {
    if(b == true){
        console.log(token);
        b=false;
    } 
    
    if(token.value === 'require'){
         console.log(token);
         b=true;
     }
     
 })
  //console.log(JSON.stringify(a));
//   a.body.forEach((n) => {
//       console.log('*****');
//       console.log(n)
//     });
  return {http:false};
}



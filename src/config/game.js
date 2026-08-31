export const SYMBOLS = [
  ['rose','Red rose','red-rose.png'],['boat','Lake Illawarra fishing boat','fishing-boat.png'],
  ['swan','Black swan','black-swan.png'],['lamp',"Miner's lamp",'miners-lamp.png'],
  ['lighthouse','Wollongong lighthouse','wollongong-lighthouse.png'],['pelican','Lake Illawarra pelican','pelican.png'],
  ['sunset','Lake Illawarra sunset','lake-illawarra-sunset.png'],['steelworks','Port Kembla steelworks','steelworks.png'],
  ['wild','Molten steel wild','wild-molten-steel.png'],['scatter','Three pelicans free-games symbol','free-three-pelicans.png']
].map(([id,label,file])=>({id,label,file,wild:id==='wild',scatter:id==='scatter'}));
export const PAYTABLE={rose:[1,2,4],boat:[2,3,6],swan:[2,4,8],lamp:[2,6,12],lighthouse:[3,10,20],pelican:[5,16,32],sunset:[10,24,48],steelworks:[16,40,80],wild:[0,0,160]};
export const PAYLINES=[
 [0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],
 [0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],[2,2,1,0,0],[0,1,0,1,0],[2,1,2,1,2]
];
// Explicit independent per-cell symbol weights; feature increases wild moderately.
export const WEIGHTS={base:{rose:17,boat:16,swan:15,lamp:14,lighthouse:10,pelican:5,sunset:2,steelworks:.5,wild:1.3,scatter:2.8},free:{rose:17,boat:16,swan:15,lamp:14,lighthouse:10,pelican:5,sunset:2,steelworks:.5,wild:2.2,scatter:2.8}};
export const FEATURE={initial:8,retrigger:5,cap:18,multiplier:2};

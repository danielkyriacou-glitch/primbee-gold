export const SYMBOLS = [
  ['rose','Red rose','red-rose.png'],['boat','Lake Illawarra fishing boat','fishing-boat.png'],
  ['swan','Black swan','black-swan.png'],['lamp',"Miner's lamp",'miners-lamp.png'],
  ['lighthouse','Wollongong lighthouse','wollongong-lighthouse.png'],['pelican','Lake Illawarra pelican','pelican.png'],
  ['sunset','Lake Illawarra sunset','lake-illawarra-sunset.png'],['steelworks','Port Kembla steelworks','steelworks.png'],
  ['wild','Molten steel wild','wild-molten-steel.png'],['scatter','Three pelicans free-games symbol','free-three-pelicans.png']
].map(([id,label,file])=>({id,label,file,wild:id==='wild',scatter:id==='scatter'}));
export const PAYTABLE={rose:[1,2,5],boat:[2,4,8],swan:[2,5,10],lamp:[3,8,15],lighthouse:[5,12,25],pelican:[8,20,40],sunset:[12,30,60],steelworks:[20,50,100],wild:[0,0,200]};
export const PAYLINES=[
 [0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],
 [0,1,2,1,0],[2,1,0,1,2],[0,0,1,2,2],[2,2,1,0,0],[0,1,0,1,0],[2,1,2,1,2]
];
// Independently selected cells. The order of regular weights is the approved rarity order.
export const WEIGHTS={base:{rose:19,boat:16,swan:15,lamp:14,lighthouse:9,pelican:4,sunset:1.5,steelworks:.4,wild:.3,scatter:2.7},free:{rose:19,boat:16,swan:15,lamp:14,lighthouse:9,pelican:4,sunset:1.5,steelworks:.4,wild:.45,scatter:2.7}};
export const FEATURE={initial:8,retrigger:5,cap:18,multiplier:2};

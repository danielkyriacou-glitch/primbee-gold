export const SYMBOLS = [
  ['rose','Koala','koala.jpg'],['boat','Kookaburra','kookaburra.jpg'],
  ['swan','Wombat','wombat.jpg'],['lamp','Kangaroo','kangaroo.jpg'],
  ['lighthouse','Cockatoo','cockatoo.jpg'],['pelican','Platypus','platypus.jpg'],
  ['sunset','Echidna','echidna.jpg'],['steelworks','Crocodile','crocodile.jpg'],
  ['wild','Tasmanian Tiger WILD','wild-thylacine.jpg'],['scatter','Lorikeets FREE GAMES','free-lorikeets.jpg']
].map(([id,label,file])=>({id,label,file,wild:id==='wild',scatter:id==='scatter'}));
export const PAYTABLE={rose:[1,2,3],boat:[1,2,3],swan:[1,2,4],lamp:[2,4,8],lighthouse:[2,6,12],pelican:[3,8,16],sunset:[1,5,12,25],steelworks:[2,8,20,40],wild:[0,0,100]};
export const PAYLINES=[
 [0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2],
 [0,1,2,1,0],[2,1,0,1,2],[1,0,0,0,1],[1,2,2,2,1],[0,1,1,1,0],[2,1,1,1,2],
 [0,0,1,0,0],[2,2,1,2,2],[1,1,0,1,1],[1,1,2,1,1],[0,1,0,1,0],[2,1,2,1,2]
];
export const WEIGHTS={base:{rose:19,boat:16,swan:15,lamp:14,lighthouse:9,pelican:4,sunset:1.5,steelworks:.4,wild:.3,scatter:2.7},free:{rose:19,boat:16,swan:15,lamp:14,lighthouse:9,pelican:4,sunset:1.5,steelworks:.4,wild:.45,scatter:2.7}};
export const FEATURE={initial:8,retrigger:5,cap:18,multiplier:2};

/*!
 * Powered by uglifiyJS v2.6.1, Build by http://tool.uis.cc/jsmin/
 * build time: Wed Sep 21 2022 10:51:55 GMT+0800 (中国标准时间)
*/
function celebrate(){$confetti.fadeIn(),$clock.removeClass("animated flipInX"),$clock.addClass("animated flipOutX"),clearTimeout(timeout),setTimeout(function(){$message.addClass("animated flipInX").fadeIn(),timeout=setTimeout(bounce,interval)},350)}function pulse(){$clock.removeClass("animated flipInX flipOutX pulse"),clearTimeout(timeout),timeout=setTimeout(function(){$clock.addClass("animated pulse")},50)}function bounce(){clearTimeout(timeout),$message.removeClass("animated bounce flipInX pulse rubberBand swing tada"),setTimeout(function(){$message.addClass("animated "+animations[current_animation]),current_animation++,current_animation==animations.length&&(current_animation=0)},100),timeout=setTimeout(bounce,interval)}(function(){var t,e,i,n,o,a,s,r,u,c,m,l;i=350,t=[[85,71,106],[174,61,99],[219,56,83],[244,92,68],[248,182,70]],n=2*Math.PI,o=document.getElementById("confetti"),s=o.getContext("2d"),window.w=0,window.h=0,m=function(){return window.w=o.width=window.innerWidth,window.h=o.height=window.innerHeight},window.addEventListener("resize",m,!1),window.onload=function(){return setTimeout(m,0)},c=function(t,e){return(e-t)*Math.random()+t},r=function(t,e,i,o){return s.beginPath(),s.arc(t,e,i,0,n,!1),s.fillStyle=o,s.fill()},l=.4,document.onmousemove=function(t){return l=t.pageX/w},window.requestAnimationFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}(),e=function(){function e(){this.style=t[~~c(0,5)],this.rgb="rgba("+this.style[0]+","+this.style[1]+","+this.style[2],this.r=~~c(2,6),this.r2=2*this.r,this.replace()}return e.prototype.replace=function(){return this.opacity=0,this.dop=.03*c(1,4),this.x=c(-this.r2,w-this.r2),this.y=c(-20,h-this.r2),this.xmax=w-this.r,this.ymax=h-this.r,this.vx=c(0,2)+8*l-5,this.vy=.7*this.r+c(-1,1)},e.prototype.draw=function(){var t;return this.x+=this.vx,this.y+=this.vy,this.opacity+=this.dop,this.opacity>1&&(this.opacity=1,this.dop*=-1),(this.opacity<0||this.y>this.ymax)&&this.replace(),0<(t=this.x)&&t<this.xmax||(this.x=(this.x+this.xmax)%this.xmax),r(~~this.x,~~this.y,this.r,""+this.rgb+","+this.opacity+")")},e}(),a=function(){var t,n;for(n=[],u=t=1;i>=1?i>=t:t>=i;u=i>=1?++t:--t)n.push(new e);return n}(),window.step=function(){var t,e,i,n;for(requestAnimationFrame(step),s.clearRect(0,0,w,h),n=[],e=0,i=a.length;i>e;e++)t=a[e],n.push(t.draw());return n},step()}).call(this);var clock,$clock=$(".clock"),$message=$(".message"),$confetti=$("#confetti"),animations=["bounce","pulse","rubberBand","swing","tada"],current_animation=0,timeout=null,interval=1e4;$(document).ready(function(){var t=new Date,e=(new Date(t.getFullYear()+1,0,1),new Date("2022-09-29T19:00:00")),i=e.getTime()/1e3-t.getTime()/1e3;clock=$clock.FlipClock(i,{clockFace:"DailyCounter",countdown:!0,callbacks:{interval:function(){var t=this.factory.getTime().time;10>=t&&t>0?pulse():0>=t&&celebrate()}}})});
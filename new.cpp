#include <iostream>
using namespace std;

int power_of_two(int n){
   int power=1;
   if(n>=0){
        for(int i=0;i<n;i++){
            power*=2;
        }
   }
//   else{
//       for(int i=0;i<n*(-1);i++){
//           power=(power/2);
//       }
//   }
    return power;
}
int main() {
	int t;
	// cin>>t;
	// while(t--){
	    int n;
	    cin>>n;
	    int A[n],B[n],C[n],sum=0;
	    for(int i=0;i<n;i++){
	       cin>> B[i];
	    }
	    for(int i=0;i<n;i++){
	        A[i]=power_of_two(i);
	    }
	   // for(int i=0;i<4;i++){
	   //     cout<<A[i]<<endl;
	        
	   // }
	   for(int i=0;i<n;i++){
	       C[i]=A[i]*B[i];
	       sum+=C[i];
	   }
	   cout<<sum<<endl;
	// }
	return 0;
}

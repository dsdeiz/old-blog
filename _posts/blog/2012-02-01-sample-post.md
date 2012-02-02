---
layout: post
title: Sample Post
category: blog
---

Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et est porta erat sodales suscipit. Vestibulum a est enim, in volutpat diam. Ut sollicitudin egestas dui, sit amet consectetur magna sodales ac. Nam vitae enim non justo eleifend dapibus. Ut in mi eu nunc placerat dictum eget at felis. Aenean augue tellus, vulputate quis condimentum non, congue eget diam. Nunc accumsan consequat risus ac aliquet. Morbi risus nisl, posuere non rhoncus eu, fringilla sed orci.

Integer tristique aliquet dignissim. Duis euismod fringilla fringilla. Phasellus a vulputate elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Suspendisse vitae erat tortor, quis bibendum est. Aenean nec neque nec est vehicula pharetra. Nulla et tellus mi, nec facilisis quam. Fusce imperdiet elit eu enim porttitor non tincidunt mi tempus. Donec at accumsan justo. Etiam sed purus elit, a feugiat nulla.

{% highlight c %}
#include <stdio.h>
#include <stdlib.h>

/**
 * Use Euclid's algorithm to get the Greatest Common Divisor.
 * See http://en.wikipedia.org/wiki/Greatest_common_divisor#Using_Euclid.27s_algorithm.
 */
int gcf(int a, int b) {
  int tmp;

  /* GCF is 1 if a or b is equal to 0. */
  if (a == 0 || b == 0) return 1;

  /* Swap the two variables in case b is greater than a. */
  if (a < b) {
    tmp = a;
    a = b;
    b = tmp;
  }

  if (a % b == 0) {
    return b;
  }
  else {
    return gcf(b, (a % b));
  }
}

/**
 * See http://en.wikipedia.org/wiki/Least_common_multiple#Reduction_by_the_greatest_common_divisor
 * for computation. Use the gcf() function.
 */
int lcm(int a, int b) {
  /* No LCM if a or b is equal to 0. */
  if (b == 0) return 0;
  else return (b / gcf(a, b)) * a;
}

int main(int argc, char *argv[]) {
  int a, b;
  char ch;

  printf("##########################################################################\n");
  printf("#####              GCF - Greatest Common Factor                      #####\n");
  printf("#####              LCM - Least Common Multiple                       #####\n");
  printf("#####                     GCF and LCM Tool                           #####\n");
  printf("#####                                                                #####\n");
  printf("##### By inputting the two integers the program will automatically   #####\n");
  printf("##### give the greatest common factor and least common denominator   #####\n");
  printf("##### of the given number.                                           #####\n");
  printf("##########################################################################\n\n");

  do {
      printf("Enter integer 1: ");
      scanf("%d", &a);

      printf("Enter integer 2: ");
      scanf("%d", &b);

      printf("\nGreatest common factor: %d\n", gcf(a, b));
      printf("Least common multiple: %d\n", lcm(a, b));
      fflush(stdin);

      printf("\nRetry? Enter 'n' if you wish to quit: ");
      ch = getchar();
  } while (ch != 'n');

  return 0;
}
{% endhighlight %}
